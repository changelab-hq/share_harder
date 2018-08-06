module ExperimentsHelper

  # Subset of parameters that should be forwarded to the image
  def image_parameters(params)
    params.slice!('v', *params.keys.select { |k| k.starts_with? 'm_' })
  end
end
