class Variant < ApplicationRecord
  include IdentityCache
  include Redis::Objects
  
  belongs_to :experiment
  has_many :shares

  counter :share_counter
  counter :click_counter
  counter :goal_counter

  def render_metatags(params)
    {
      title: render(title, params),
      description: render(description, params)
    }
  end

  def render(template, params)
    merge_params = {}
    params.to_unsafe_hash.each do |k,v| k.starts_with? 'm_'
      merge_params[k[2..-1]] = v
    end
    Mustache.render(template, merge_params)
  end
end
