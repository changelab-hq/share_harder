describe User do
  describe '#find_or_create_from_auth_hash' do
    let(:info) { double("", email: 'test@example.com', first_name: 'Jack', last_name: 'Sprat', image: '')}
    let(:auth_hash) { double("Auth hash", :uid => '123', :provider => 'google', info: info) }

    it "Creates users as admin false" do
      user = User.find_or_create_from_auth_hash(auth_hash)
      expect(user.persisted?).to be true
      expect(user.admin).to be false
    end

    it "Automatically admins users who have a matching domain email" do
      ENV['GOOGLE_WHITELIST_DOMAIN'] = 'example.com'

      user = User.find_or_create_from_auth_hash(auth_hash)
      expect(user.persisted?).to be true
      expect(user.admin).to be true

      ENV['GOOGLE_WHITELIST_DOMAIN'] = ''
    end

    it "Doesn't reset admin to false on login" do
      user = User.find_or_create_from_auth_hash(auth_hash)
      expect(user.persisted?).to be true
      expect(user.admin).to be false

      user.update_attributes(admin: true)
      user = User.find_or_create_from_auth_hash(auth_hash)
      expect(user.admin).to be true
    end
  end
end
