class Experiment < ApplicationRecord
  include IdentityCache

  has_many :variants
  cache_has_many :variants, :embed => true

  accepts_nested_attributes_for :variants, allow_destroy: true

  before_save :normalize_url!

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
    cached_variants = Experiment.fetch(self.id).fetch_variants

    var_results = cached_variants.map do |var|
      var.as_json.merge({
        share_count: var.share_counter.value,
        click_count: var.click_counter.value,
        goal_count: var.goal_counter.value
      })
    end

    self.as_json.merge({
      variants: var_results,
      total_shares: var_results.inject(0){ |sum, v| sum += v[:share_count] },
      total_clicks: var_results.inject(0){ |sum, v| sum += v[:click_count] },
      total_goals: var_results.inject(0){ |sum, v| sum += v[:goal_count] }
      })
  end

  # Alpha = success count per variation
  # Beta = fail count per variation
  def choose_bandit_variant
    cached_variants = Experiment.fetch(self.id).fetch_variants

    alphabeta = cached_variants.map.with_index do |var|
      goal_count = var.goal_counter.value
      [goal_count, var.share_counter.value * 100 - goal_count]
    end

    # Draw a sample from beta distibution for each variant and choose the variant with highest value
    selected_variant_idx = choose_n_times(alphabeta, 1).sort_by{|v| -v[1]}
                    .map{|v| v[0]}[0]

    cached_variants[selected_variant_idx]
  end

  def choose_n_times(alphabeta, n)
    sr = SimpleRandom.new
    sr.set_seed

    probsums = Array.new(alphabeta.count, 0)
    n.times do
      alphabeta.each_with_index{ |c,i| probsums[i] += sr.beta(0.5 + c[0], 0.5 + c[1]) }
    end
    probsums.map.with_index{|probsum, i| [i, probsum / n] }
  end

  # For easier testing - call "simulate" and pass in expected prob of a share from each variant getting a click on each cycle
  def simulate(probs)
    raise "Probs don't match the number of variants" unless probs.count == variants.count

    loop do
      key = SecureRandom.hex
      share = get_share_by_key(key)
      cached_variants = Experiment.fetch(self.id).fetch_variants
      cached_variants.each_with_index do |var, i|
        var.shares.each_with_index do |share|
          if rand() < probs[i]
            share.add_click()
            if rand() < probs[i]
              share.add_goal()
            end
          end
        end
      end
      sleep 1
    end
  end
end
