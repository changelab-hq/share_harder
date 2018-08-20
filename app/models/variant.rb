class Variant < ApplicationRecord
  include IdentityCache
  include Redis::Objects

  belongs_to :experiment, counter_cache: true
  has_many :shares

  counter :share_counter
  counter :click_counter
  counter :allowed_goal_counter

  def refresh_allowed_goal_counter
    allowed_goal_count = shares.sum("LEAST(goal_count, 5)")
    allowed_goal_counter.reset(allowed_goal_count)
  end

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

  def get_font(font)
    font_filename = "fonts/#{font}.tff"
    unless File.file?(font_filename)
      @font_info ||= JSON.parse(open("https://www.googleapis.com/webfonts/v1/webfonts?key=#{ENV['GOOGLE_FONTS_API_KEY']}").read)
      item = @font_info['items'].select{|x| x['family'] == font }
      font_url = item.first['files']['700'] || item.first['files']['regular']
      `mkdir -p fonts`
      IO.copy_stream(open(font_url), font_filename)
    end

    return font_filename
  end

  def get_image(image_url)
    `mkdir -p images`
    image_filename = "images/variant_#{id}_#{Digest::MD5.hexdigest(image_url)}"
    unless File.file?(image_filename)
      IO.copy_stream(open(image_url), image_filename)
    end

    image_filename
  end

  def render_to_jpg(params)
    rendered_overlays = overlays.map do |k, o|
      o['text'] = render(o['text'], params)
      if o['align'].present?
        o['left'] = 0
        o['top'] = o['top'].to_i - 167
      end
      o
    end

    img = MiniMagick::Image.open(get_image(image_url))
    img.resize('540x300!') # "!" forces image to distort

    rendered_overlays.each do |o|
      font_path = get_font(o['font'])
      img.combine_options do |c|
        c.font font_path
        c.draw %Q{text #{o['left']},#{o['top'].to_i + o['size'].to_i} "#{o['text']}"}
        c.pointsize o['size']
        c.fill(o['color'])
        if o['textStrokeWidth'].to_i > 0
          c.stroke o['textStrokeColor']
          c.strokewidth o['textStrokeWidth']
        end
        if o['align'].present?
          c.gravity({'left' => 'west', 'center' => 'center', 'right' => 'east'}[o['align']])
        end
      end
    end

    img.format 'jpg'
    img
  end
end
