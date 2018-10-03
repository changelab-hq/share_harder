class AddArchivedExperiments < ActiveRecord::Migration[5.2]
  def change
    add_column :experiments, :archived_at, :timestamp
  end
end
