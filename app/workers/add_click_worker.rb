class AddClickWorker
  include Sidekiq::Worker

  def perform(key)
    Share.find_by(key: key).add_click
  end
end
