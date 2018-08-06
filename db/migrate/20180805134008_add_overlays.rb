class AddOverlays < ActiveRecord::Migration[5.2]
  def change
    add_column :variants, :overlays, :jsonb, null:false, default: []
  end
end
