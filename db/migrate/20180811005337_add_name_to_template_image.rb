class AddNameToTemplateImage < ActiveRecord::Migration[5.2]
  def change
    add_column :template_images, :name, :text
  end
end
