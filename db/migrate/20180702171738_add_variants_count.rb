class AddVariantsCount < ActiveRecord::Migration[5.2]
  def change
    add_column :experiments, :variants_count, :integer, null: false, default: 0
  end
end
