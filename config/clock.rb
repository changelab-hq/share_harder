require 'clockwork'
require 'sidekiq'

module Clockwork

  every(1.minute, "Calculate correct goal count") {  }

  error_handler do |error|
    Airbrake.notify(error)
    Rollbar.error(error) if Settings.rollbar.api_key.present?
  end
end
