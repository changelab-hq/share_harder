class AddPrefilText < ActiveRecord::Migration[5.2]
  def change
    add_column :variants, :prefill_text, :text
  end
end
