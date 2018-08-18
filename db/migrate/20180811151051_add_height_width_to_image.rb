class AddHeightWidthToImage < ActiveRecord::Migration[5.2]
  def change
    add_column :template_images, :height, :float, null: false, default: 400
    add_column :template_images, :width, :float, null: false, default: 400
  end
end
