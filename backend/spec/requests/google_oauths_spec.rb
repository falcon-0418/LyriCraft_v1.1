require 'rails_helper'
require 'webmock/rspec'

RSpec.describe 'Google OAuth ', type: :request do
  let(:client_id) { 'client-id' }
  let(:client_secret) { 'client-secret' }
  let(:auth_code) { 'fake_auth_code' }
  let(:new_user_email) { 'newuser@example.com' }
  let(:new_user_name) { 'New User' }
  let(:google_uid) { '123456789' }
  let(:provider) { 'google_oauth2' }
  let(:token_response) do
    {
      expires_in: 3600,
      token_type: 'Bearer',
      refresh_token: 'fake_refresh_token',
      id_token: 'fake_id_token'
    }.to_json
  end

  before do
    setup_omniauth_mock
  end

  describe 'Google認証画面にリダイレクトされること' do
    it '正しいURLにリダイレクトされる' do
      get '/auth/google_oauth2'
      expect(response).to redirect_to(/auth\/google_oauth2\/callback/)
    end
  end

  describe 'Google認証を終えた後' do
    context 'アクセストークンが正しく処理された場合' do
      it 'バックエンドが認証情報を受け取っていること' do
        oauth_callback
        expect(request.params['code']).to eq(auth_code)
      end

      context 'ユーザーとユーザー認証情報が存在しない場合'do
        it 'ユーザーが新規登録される' do
          expect {
            oauth_callback
          }.to change { User.count }.by(1)

          user = find_user_by_email
          expect(user).not_to be_nil
          expect(user.name).to eq(new_user_name)
        end

        it 'ユーザー認証情報が新規登録される' do
          expect {
            oauth_callback
          }.to change { UserAuthentication.count }.by(1)

          user_auth = UserAuthentication.find_by(uid: google_uid, provider: provider)
          user = find_user_by_email
          expect(user_auth).not_to be_nil
          expect(user_auth.user).to eq(user)
        end
      end

      context 'ユーザー情報とユーザー認証情報が存在する場合' do
        let!(:existing_user) { create(:user, name: new_user_name, email: new_user_email) }
        let!(:existing_user_auth) { create(:user_authentication, user: existing_user, uid: google_uid, provider: provider) }
        it '新しいユーザーが作成されないこと' do
          expect {
            oauth_callback
          }.not_to change { User.count }
        end

        it '新しいユーザー認証情報が作成されないこと' do
          expect {
            oauth_callback
          }.not_to change { User.count }
        end
      end

      context 'ユーザーとユーザー認証情報の処理が終わったら' do
        before do
          allow(Api::JsonWebToken).to receive(:encode).and_call_original
          oauth_callback
        end
        it 'jwtトークンをエンコードすること' do
          user = find_user_by_email
          expect(Api::JsonWebToken).to have_received(:encode).with(user_id: user.id).once
        end

        it 'jwtトークンがクエリパラメータとしてフロントエンドにリダイレクトされること' do
          expect(response).to have_http_status(:found)
          redirect_url = response.location
          token = redirect_url.match(%r{accesstoken=(.+)})[1]
          expect(token).not_to be_nil
        end
      end
    end
  end
end
