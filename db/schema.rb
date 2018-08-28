# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_08_26_202152) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "clicks", force: :cascade do |t|
    t.bigint "share_id", null: false
    t.text "user_agent"
    t.text "ip_address"
    t.text "key", null: false
    t.datetime "goal_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_clicks_on_key"
    t.index ["share_id"], name: "index_clicks_on_share_id"
  end

  create_table "experiments", force: :cascade do |t|
    t.text "name", null: false
    t.text "url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "variants_count", default: 0, null: false
    t.datetime "archived_at"
  end

  create_table "shares", force: :cascade do |t|
    t.bigint "variant_id", null: false
    t.bigint "share_id"
    t.text "key"
    t.integer "click_count", default: 0, null: false
    t.integer "goal_count", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["key"], name: "index_shares_on_key"
    t.index ["share_id"], name: "index_shares_on_share_id"
    t.index ["variant_id"], name: "index_shares_on_variant_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "provider"
    t.string "uid"
    t.string "email"
    t.string "first_name"
    t.string "last_name"
    t.string "picture"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "admin", default: false, null: false
  end

  create_table "variants", force: :cascade do |t|
    t.bigint "experiment_id", null: false
    t.text "description", null: false
    t.text "title", null: false
    t.text "image_url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "overlays", default: [], null: false
    t.index ["experiment_id"], name: "index_variants_on_experiment_id"
  end

end
