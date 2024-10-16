module OmniAuthHelper
  def setup_omniauth_mock
    OmniAuth.config.test_mode = true

    OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new({
      provider: 'google_oauth2',
      uid: '123456789',
      info: {
        name: 'New User',
        email: 'newuser@example.com'
      }
    })

    stub_request(:post, "https://oauth2.googleapis.com/token").
      with(body: hash_including(client_id: 'your-client-id', client_secret: 'your-client-secret', auth_code: 'fake_auth_code')).
      to_return(
        status: 200,
        body: {
          expires_in: 3600,
          token_type: 'Bearer',
          refresh_token: 'fake_refresh_token',
          id_token: 'fake_id_token'
        }.to_json,
        headers: { 'Content-Type' => 'application/json' }
      )
  end

  def oauth_callback
    get '/auth/google_oauth2/callback', params: { code: auth_code }
  end

  def find_user_by_email
    User.find_by(email: 'newuser@example.com')
  end
end
