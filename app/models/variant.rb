class Variant < ApplicationRecord
  include IdentityCache
  include Redis::Objects

  belongs_to :experiment, counter_cache: true
  has_one :template_image
  has_many :shares

  accepts_nested_attributes_for :template_image

  counter :share_counter
  counter :click_counter
  counter :goal_counter

  def render_metatags(params)
    {
      title: Renderer.new.render(title, params),
      description: Renderer.new.render(description, params)
    }
  end
end
