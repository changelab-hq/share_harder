class TemplateImage < ApplicationRecord
  belongs_to :variant, optional: true

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

  def get_image(url)
    `mkdir -p images`
    image_filename = "images/variant_#{id}_#{Digest::MD5.hexdigest(url)}"
    unless File.file?(image_filename)
      IO.copy_stream(open(url), image_filename)
    end

    image_filename
  end

  def render_to_jpg(params)
    rendered_overlays = overlays.map do |k, o|
      o['text'] = Renderer.new.render(o['text'], params)
      # Adjust co-ordinates to centre
        # o['left'] = o['left'].to_i - width / 2
        # o['top'] = o['top'].to_i - height / 2
      o
    end

    img = MiniMagick::Image.open(get_image(url))
    img.resize(width.to_s+'x'+height.to_s+'!') # "!" forces image to distort

    rendered_overlays.each do |o|
      font_path = get_font(o['font'])

      # MiniMagick::Tool::Convert.new do |c|
      #   c.gravity 'center'
      #   c.font font_path
      #   c.xc 'white'
      #   c.draw %Q{text #{o['left']},#{o['top'].to_i + o['size'].to_i} "#{o['text']}"}
      #   c.quality 100
      #   c << "temp_image.png"
      # end

      `rm temp_image.png`

      MiniMagick::Tool::Convert.new do |i|
        i.background 'rgba(0,0,0,0)'
        i.pointsize o['size']
        i.font font_path
        i.fill(o['color'])
        if o['textStrokeWidth'].to_i > 0
          i.stroke o['textStrokeColor']
          i.strokewidth o['textStrokeWidth']
        end
        i.label o['text']
        i.rotate o['rotation']
        i << "temp_image.png"
      end

      text_img = MiniMagick::Image.open("temp_image.png")

      img = img.composite(text_img) do |c|
        c.compose "Over" # OverCompositeOp
        c.geometry "+#{o['left'].to_i}+#{o['top'].to_i}" # copy second_image onto first_image from (20, 20)
      end
    end

    img.format 'jpg'
    img
  end
end
