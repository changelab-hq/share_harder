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

  def get_share_by_key(key, variant_id = nil, referrer_key = nil)
    unless share = Share.find_by(key: key)
      if variant_id.present?
        variant = Variant.find(variant_id)
      else
        variant = choose_bandit_variant
      end

      if referrer_key.present?
        referrer_share = Share.find_by(key: referrer_key)
      else
        referrer_share = nil
      end

      share = Share.create!(variant: variant, key: key, share: referrer_share)
    end

    return share
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
    sr = SimpleRandom.new
    sr.set_seed
    selected_variant_idx = alphabeta.map.with_index{|c,i| [i, sr.beta(0.5 + c[0], 0.5 + c[1])]}
                    .sort_by{|v| -v[1]}
                    .map{|v| v[0]}[0]

    cached_variants[selected_variant_idx]
  end
end
