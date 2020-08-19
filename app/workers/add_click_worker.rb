class AddClickWorker
  include Sidekiq::Worker

  def perform(key, click_key, user_agent, ip_address)
    share = Share.find_by(key: key)
    Click.create!(share: share, key: click_key, user_agent: user_agent, ip_address: ip_address)
    share.increment_clicks
  end
end
