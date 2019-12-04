require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module ShareHarder
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2

    config.eager_load_paths << Rails.root.join('lib')
    config.autoload_paths << Rails.root.join('lib')

    config.identity_cache_store = :redis_store, ENV['REDIS_URL'], { expires_in: 60.minutes }
    IdentityCache.cache_backend = ActiveSupport::Cache.lookup_store(*Rails.configuration.identity_cache_store)

    Mime::Type.register "image/jpg", :jpg

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '/api/variant', :headers => :any, :methods => [:get]
        resource '/api/record_goal', :headers => :any, :methods => [:post]
        resource '/api/register_share', :headers => :any, :methods => [:post]
      end
    end
  end
end
