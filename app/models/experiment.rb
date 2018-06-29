class Experiment < ApplicationRecord
  include IdentityCache

  has_many :variants
  accepts_nested_attributes_for :variants, allow_destroy: true

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

  def choose_bandit_variant
    variants.sample
  end
end
