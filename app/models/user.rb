class User < ApplicationRecord
  def self.find_or_create_from_auth_hash(auth)
    if ENV['GOOGLE_WHITELIST_DOMAIN'].present? && auth.info.email.split('@').last == ENV['GOOGLE_WHITELIST_DOMAIN']
      admin = true
    else
      admin = false
    end

    where(provider: auth.provider, uid: auth.uid).first_or_initialize.tap do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.first_name = auth.info.first_name
      user.last_name = auth.info.last_name
      user.email = auth.info.email
      user.picture = auth.info.image
      user.admin = admin
      user.save!
    end
  end
end
