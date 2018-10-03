class Experiment < ApplicationRecord
  include IdentityCache

  has_many :variants
  cache_has_many :variants, :embed => true, inverse_name: :experiment

  accepts_nested_attributes_for :variants, allow_destroy: true

  before_save :normalize_url!

  def archived?
    archived_at.present?
  end

  def self.lookup_by_url(url)
    Experiment.find_by(url: Experiment.normalize_url(url))
  end

  def normalize_url!
    Rails.logger.info(attributes)
    self.url = Experiment.normalize_url(self.url)
  end

  def self.normalize_url(url)
    url.strip.downcase.split('?').first.split('//').last
  end

  def get_share_by_key(key, variant_id = nil, click_key = nil)
    unless share = Share.find_by(key: key)
      if variant_id.present?
        variant = Variant.find(variant_id)
      else
        variant = choose_bandit_variant
      end

      if click_key.present?
        referrer_share = Click.find_by(key: click_key).share
      else
        referrer_share = nil
      end

      share = Share.create!(variant: variant, key: key, share: referrer_share)
    end

    return share
  end

  def results
    proportions = variants_by_proportions

    low_range = 100
    high_range = 0

    var_results = cached_variants.map.with_index do |var, i|
      sc = var.share_counter.value
      cc = var.click_counter.value
      gc = var.allowed_goal_counter.value

      if sc > 0
        ci = ABAnalyzer.confidence_interval(gc, sc*100, 0.95).map{|x| x*100 }
      else
        ci = [0.0, 0.0]
      end

      low_range = [low_range, ci[0]].min
      high_range = [high_range, ci[1]].max

      var.as_json.merge({
        template_image: var.fetch_template_image.as_json,
        share_count: sc,
        click_count: cc,
        goal_count: gc,
        proportion: proportions[i][1],
        confidence_interval: ci
      })
    end

    self.as_json.merge({
      variants: var_results,
      total_shares: var_results.inject(0){ |sum, v| sum += v[:share_count] },
      total_clicks: var_results.inject(0){ |sum, v| sum += v[:click_count] },
      total_goals: var_results.inject(0){ |sum, v| sum += v[:goal_count] },
      low_range: low_range,
      high_range: high_range
      })
  end

  # Alpha = success count per variation
  # Beta = fail count per variation
  def choose_bandit_variant
    selected_variant_idx = index_of_max(choose_n_times(alphabeta, 1))
    cached_variants[selected_variant_idx]
  end

  def index_of_max(arr)
    arr.map.with_index{ |v, i| [i,v] }.sort_by{|v| -v[1]}.map{|v| v[0]}[0]
  end

  def variants_by_proportions
    return [] unless variants.count > 0
    choices = choose_n_times(alphabeta, 1000)
    choices.map! { |c| c.to_f / 1000 }
    cached_variants.zip(choices)
  end

  # Choose a variant n times, and return the number of times each variant chosen
  def choose_n_times(alphabeta, n)
    sr = SimpleRandom.new
    sr.set_seed

    choices = Array.new(alphabeta.count, 0)

    n.times do
      probsums = Array.new(alphabeta.count, 0)
      alphabeta.each_with_index{ |c,i| probsums[i] = sr.beta(0.5 + c[0], 0.5 + c[1]) }
      idx = probsums.map.with_index{|probsum, i| [i, probsum] }.sort_by{|v| -v[1]}.map{|v| v[0]}[0]
      choices[idx] += 1
    end

    return choices
  end

  def cached_variants
    @cached_variants ||= Experiment.fetch(self.id).fetch_variants.sort_by { |v| v.id }
  end

  def alphabeta
    cached_variants.map.with_index do |var|
      goal_count = var.allowed_goal_counter.value
      [goal_count, [var.share_counter.value * 100 - goal_count, 0].max]
    end
  end

  # For easier testing - call "simulate" and pass in expected prob of a share from each variant getting a click on each cycle
  def simulate(probs)
    raise "Probs don't match the number of variants" unless probs.count == variants.count

    loop do
      key = SecureRandom.hex
      share = get_share_by_key(key)
      cached_variants.each_with_index do |var, i|
        var.shares.each_with_index do |share|
          if rand() < probs[i]
            click_key = SecureRandom.hex
            AddClickWorker.new.perform(share.key, click_key, '', '')
            if rand() < probs[i]
              AddGoalWorker.new.perform(click_key, Time.now)
            end
          end
        end
      end
      sleep 1
    end
  end
end
