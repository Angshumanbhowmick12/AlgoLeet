import React from 'react'
import {useForm} from "react-hook-form";
import {X} from "lucide-react";
import { Button } from './ui/button';
const CreatePlaylistModal = ({isOpen , onClose , onSubmit}) => {
    const {register , handleSubmit , formState:{errors} , reset} = useForm();

    const handleFormSubmit = async (data)=>{
        await onSubmit(data);
        reset()
        onClose()
    }

    if(!isOpen) return null;

  return (
   <div className="fixed inset-0 bg-muted flex items-center justify-center z-50">
      <div className="bg-accent/20 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-accent">
          <h3 className="text-xl font-bold">Create New Playlist</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Playlist Name</span>
            </label>
            <input
              type="text"
              className=" bg-accent input input-bordered w-full"
              placeholder="Enter playlist name"
              {...register('name', { required: 'Playlist name is required' })}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              className="textarea bg-accent textarea-bordered h-24"
              placeholder="Enter playlist description"
              {...register('description')}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <Button type="submit" className=" bg-amber-600">
              Create Playlist
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePlaylistModal