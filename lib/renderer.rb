class Renderer
  def render(template, params)
    merge_params = {}
    params.to_unsafe_hash.each do |k,v| k.starts_with? 'm_'
      merge_params[k[2..-1]] = v
    end
    Mustache.render(template, merge_params)
  end
end
