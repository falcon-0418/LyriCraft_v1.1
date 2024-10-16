class NoteSerializer
  include FastJsonapi::ObjectSerializer

  attributes :title, :body, :created_at

  belongs_to :user
end
