# From https://stackoverflow.com/questions/378887/how-do-i-calculate-a-strings-width-in-ruby

# Everything you never wanted to know about glyphs:
# http://chanae.walon.org/pub/ttf/ttf_glyphs.htm

# this code is a substantial reworking of:
# https://github.com/prawnpdf/ttfunk/blob/master/examples/metrics.rb

class Font
  attr_reader :file

  def initialize(path_to_file)
    @file = TTFunk::File.open(path_to_file)
  end

  def width_of(string)
    string.split('').map { |char| character_width(char) }.inject { |sum, x| sum + x }
  end

  def character_width(character)
    width_in_units = horizontal_metrics.for(glyph_id(character)).advance_width
    width_in_units.to_f / units_per_em
  end

  def units_per_em
    @units_per_em ||= file.header.units_per_em
  end

  def horizontal_metrics
    @hm = file.horizontal_metrics
  end

  def glyph_id(character)
    character_code = character.unpack1("U*")
    file.cmap.unicode.first[character_code]
  end

  # width in pixels
  def wrap_text(text, px_width, px_height)
    words = text.split(' ')
    lines = []
    current_line = ''
    width = px_width / px_height.to_f # in em

    words.each do |w|
      if width_of("#{current_line} #{w}".strip) > width
        if current_line.present?
          lines << current_line
          current_line = w
        else
          lines << w
        end
      else
        current_line = "#{current_line} #{w}".strip
      end
    end
    lines << current_line if current_line.present?

    lines.join("\n")
  end
end
