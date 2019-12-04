class Variant < ApplicationRecord
  include IdentityCache
  include Redis::Objects

  belongs_to :experiment, counter_cache: true
  cache_belongs_to :experiment

  has_one :template_image
  cache_has_one :template_image, embed: true
  has_many :shares

  accepts_nested_attributes_for :template_image

  counter :share_counter
  counter :click_counter
  counter :allowed_goal_counter

  def refresh_allowed_goal_counter
    allowed_goal_count = shares.sum("LEAST(goal_count, 5)")
    allowed_goal_counter.reset(allowed_goal_count)
  end

  def render_metatags(params)
    {
      title: Renderer.new.render(title, params),
      description: Renderer.new.render(description, params),
      prefill_text: Renderer.new.render(prefill_text, params)
    }
  end
end
