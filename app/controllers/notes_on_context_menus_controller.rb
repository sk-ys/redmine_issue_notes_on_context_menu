class NotesOnContextMenusController < ApplicationController
  unloadable
  before_action :find_journal
  
  helper :journal
  
  def show
    respond_to do |format|
      format.js
    end
  end
  
  private
  
  def find_journal
    @journal = Journal.visible.find(params[:id])
    @project = @journal.journalized.project
  rescue ActiveRecord::RecordNotFound
    render_404
  end
end
