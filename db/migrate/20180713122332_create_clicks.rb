class CreateClicks < ActiveRecord::Migration[5.2]
  def change
    create_table :clicks do |t|
      t.references :shares, null: false, index: true
      t.text :user_agent
      t.text :ip_address
      t.text :key, index: true, null: false
      t.timestamp :goal_at
      t.timestamps
    end
  end
end
