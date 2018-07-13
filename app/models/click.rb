class Click < ApplicationRecord
  belongs_to :share

  CHARS = ('a'..'z').to_a + ('A'..'Z').to_a + ('0'..'9').to_a

  def self.generate_key
    16.times.map { CHARS[rand(CHARS.length)] }.join
  end
end
