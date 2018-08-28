class TemplateImage < ApplicationRecord
  belongs_to :variant, optional: true
end

class Variant < ApplicationRecord
  has_one :template_image
end


class AddTemplateImages < ActiveRecord::Migration[5.2]
  def change
    create_table :template_images do |t|
      t.references :variant, index: true
      t.text :url, null: false
      t.jsonb :overlays, default: [], null: false
      t.timestamps
    end

    Variant.all.each do |v|
      next unless v.image_url.present?
      template_image = TemplateImage.create!(
        url: v.image_url,
        overlays: v.overlays,
        variant: v
        )
    end

    remove_column :variants, :image_url
    remove_column :variants, :overlays
  end
end
