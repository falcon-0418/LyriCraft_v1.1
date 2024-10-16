class Api::V1::User::NotesController < ApplicationController
  before_action :set_notes, only: :index
  before_action :set_note, only: %i[show update destroy]

  def index
    json_string = NoteSerializer.new(@notes).serialized_json

    render json: json_string
  end

  def create
    note = @current_user.notes.new(title: "", body: "")

    if note.save
      json_string = NoteSerializer.new(note).serialized_json
      render json: json_string
    else
      render_400(nil, note.errors.full_messages)
    end
  end

  def show
    json_string = NoteSerializer.new(@note).serialized_json
    render json: json_string
  end

  def update
    if @note.update(note_params)
      json_string = NoteSerializer.new(@note).serialized_json
      render json: json_string
    else
      render_400(nil, note.errors.full_messages)
    end
  end

  def destroy
    @note.destroy!
    set_notes
    json_string = NoteSerializer.new(@notes).serialized_json

    render json: json_string
  end

  private

  def set_note
    @note = @current_user.notes.find(params[:id])
  end

  def set_notes
    @notes = @current_user.notes
  end

  def note_params
    params.require(:note).permit(:title, :body)
  end
end