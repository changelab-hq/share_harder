class TemplateImage < ApplicationRecord
  include IdentityCache

  belongs_to :variant, optional: true

  def get_font(font)
    font_filename = "fonts/#{font}.tff"
    unless File.file?(font_filename)
      @font_info ||= JSON.parse(open("https://www.googleapis.com/webfonts/v1/webfonts?key=#{ENV['GOOGLE_FONTS_API_KEY']}").read)
      item = @font_info['items'].select { |x| x['family'] == font }
      font_url = item.first['files']['700'] || item.first['files']['regular']
      `mkdir -p fonts`
      IO.copy_stream(open(font_url), font_filename)
    end

    font_filename
  end

  def get_image(url)
    `mkdir -p images`
    image_filename = "images/variant_#{id}_#{width}_#{height}_#{Digest::MD5.hexdigest(url)}"
    unless File.file?(image_filename)
      IO.copy_stream(open(url), image_filename)

      # Convert once here, to avoid unnecessary resizing on every request
      MiniMagick::Tool::Convert.new do |i|
        i << image_filename
        i.resize(width.to_s + 'x' + height.to_s + '!')
        i << image_filename
      end
    end

    image_filename
  end

  def render_to_jpg(params)
    `mkdir -p images`
    temp_filename = "images/#{SecureRandom.uuid}_temp.png"
    img = MiniMagick::Image.open(get_image(url))

    overlays.values.each do |o|
      # Alignment
      o['left'] = 0 if o['align'].present?
      gravity = { 'left' => 'west', 'center' => 'center', 'right' => 'east' }[o['align']] || 'northwest'

      # Text and wrapping
      o['text'] = Renderer.new.render(o['text'], params)
      font_path = get_font(o['font'])
      text = Font.new(font_path).wrap_text(o['text'], width - o['left'].to_i, o['size'].to_i)
      # If renders to nothing, don't add text
      next if text.blank?

      MiniMagick::Tool::Convert.new do |i|
        i.background 'rgba(0,0,0,0)'
        i.pointsize o['size']
        i.font font_path
        i.fill(o['color'])
        if o['textStrokeWidth'].to_i > 0
          i.stroke o['textStrokeColor']
          i.strokewidth o['textStrokeWidth']
        end
        i.gravity gravity
        i << "label:#{text}"
        i << temp_filename
      end

      text_img = MiniMagick::Image.open(temp_filename)
      flat_height = text_img.height
      # flat_width isn't used and is a rubocop violation.
      # I think one of the uses of flat_height below should be flat_width
      # flat_width = text_img.width

      MiniMagick::Tool::Convert.new do |i|
        i << temp_filename
        i.background 'rgba(0,0,0,0)'
        i.rotate o['rotation']
        i << temp_filename
      end

      text_img = MiniMagick::Image.open(temp_filename)

      img = img.composite(text_img) do |c|
        c.compose "Over" # OverCompositeOp

        # Adjust co-ordinates based on rotation
        top = o['top'].to_i
        left = o['left'].to_i

        if o['rotation'].to_f <= -90
          left -= text_img.width
          top = top - text_img.height + flat_height
        elsif o['rotation'].to_f <= 0
          top = top - text_img.height + flat_height
        elsif o['rotation'].to_f >= 90
          left -= text_img.width
        end

        case gravity
        when 'center'
          left = (width - text_img.width) / 2
        when 'east'
          left = width - text_img.width
        end

        c.geometry "+#{left}+#{top}" # copy second_image onto first_image from (20, 20)
      end

      `rm #{temp_filename}`
    end

    img.format 'jpg'
    img
  end
end
