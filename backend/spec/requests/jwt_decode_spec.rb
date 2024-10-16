require 'rails_helper'

RSpec.describe 'JWT Token Decode', type: :request do
  let(:user) { create(:user) }
  let(:valid_token) { Api::JsonWebToken.encode(user_id: user.id) }
  let(:headers) { { 'Authorization' => "Bearer #{token}" } }

  describe 'クライアントからリクエストを受け付けたら' do
    context '有効なトークンの場合' do
      let(:token) { valid_token }

      it 'jwtトークンをデコードできること' do
        decoded_token = Api::JsonWebToken.decode(valid_token)
        expect(decoded_token[:user_id]).to eq(user.id)
      end
    end

    context '無効なトークンの場合' do
      let(:token) { 'invalid_token' }

      it 'JWT::DecodeError が発生し、Invalid token が返されること' do
        allow(Api::JsonWebToken).to receive(:decode).and_raise(JWT::DecodeError)
        get current_api_v1_users_path, headers: headers

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)['errors']).to eq('Invalid token')
      end
    end

    context 'jwtトークンがデコードされたら' do
      let(:token) { valid_token }
      it 'ユーザーIDを取得できること' do
        get current_api_v1_users_path, headers: headers
        expect(JSON.parse(response.body)['user']['id']).to eq(user.id)
      end
    end

    context 'ユーザーが存在しない場合' do
      let(:non_existent_user_token) { Api::JsonWebToken.encode(user_id: 9999) }
      let(:token) { non_existent_user_token }

      it 'ActiveRecord::RecordNotFound が発生し、ユーザーが取得できないこと' do
        allow(User).to receive(:find).and_raise(ActiveRecord::RecordNotFound)
        get current_api_v1_users_path, headers: headers

        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['errors']).to eq('User not found')
      end
    end

    context '取得したユーザー情報が正しい場合' do
      let(:token) { valid_token }
      let(:decoded_token) { { user_id: user.id } }

      it '認可ユーザーを取得できること' do
        allow(Api::JsonWebToken).to receive(:decode).and_return(decoded_token)
        get current_api_v1_users_path, headers: headers
        expect(response).to have_http_status(:ok)

        response_data = JSON.parse(response.body)
        expect(response_data['user']['id']).to eq(user.id)
        expect(response_data['user']['name']).to eq(user.name)
        expect(response_data['user']['email']).to eq(user.email)
      end
    end

    context 'ユーザー情報が正しくない場合' do
      let(:token) { valid_token }

      it 'User not found エラーが返されること' do
        allow(Api::JsonWebToken).to receive(:decode).and_return({ user_id: 9999 })
        allow(User).to receive(:find).and_raise(ActiveRecord::RecordNotFound)
        get current_api_v1_users_path, headers: headers

        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['errors']).to eq('User not found')
      end
    end

    context 'その他のエラーが発生した場合' do
      let(:token) { valid_token }

      it 'Not Authorized エラーが返されること' do
        allow(Api::JsonWebToken).to receive(:decode).and_raise(StandardError.new("Unexpected error"))
        get current_api_v1_users_path, headers: headers

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)['errors']).to eq('Not Authorized')
      end
    end
  end
end
