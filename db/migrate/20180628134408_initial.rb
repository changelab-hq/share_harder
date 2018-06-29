class Initial < ActiveRecord::Migration[5.2]
  def change
    create_table :experiments do |t|
      t.text :name, null: false
      t.text :url, null: false
      t.timestamps
    end
    
    create_table :variants do |t|
      t.references :experiment, null: false, index: true
      t.text :description, null: false
      t.text :title, null: false
      t.text :image_url, null: false
      t.timestamps
    end
    
    create_table :shares do |t|
      t.references :variant, null: false, index: true
      t.references :share, index: true
      t.text :key, index: true
      t.integer :click_count, null: false, default: 0
      t.integer :goal_count, null: false, default: 0
      t.timestamps
    end
  end
end
