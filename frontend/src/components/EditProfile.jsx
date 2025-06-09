import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
import { Upload } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
// axiosInstance is not directly needed in the component if the store handles the API call
// import { axiosInstance } from '../lib/axios'; // This line can be removed from the component

const EditProfile = () => {
    // State to hold the selected file
    const [selectedFile, setSelectedFile] = useState(null);
    // State to manage the dialog open/close status
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // State for local error messages
    const [errorMessage, setErrorMessage] = useState('');

    // Get the updateImage action and loading state from your Zustand store
    const { updateImage, isimage, authUser } = useAuthStore(); // Added authUser to observe updates if needed

    // Handler for when a file is selected in the input
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setErrorMessage(''); // Clear previous errors when a new file is selected
        }
    };

    // This function now triggers the store action
    const handleUpload = async () => {
        setErrorMessage(''); // Clear any previous error messages

        if (!selectedFile) {
            setErrorMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        // The key 'image' here should match the field name your backend expects for the file.
        // It was 'file' in your previous attempt, if your backend expects 'file', use that.
        // I'm using 'image' as a common convention. Adjust as per your backend.
        formData.append('image', selectedFile);

        try {
            // Call the store's action with the FormData object
            await updateImage(formData); // This will handle the API call, loading state, and authUser update
            
            // If the upload was successful, close the dialog and clear the selected file
            setSelectedFile(null); // Clear the file input
            setIsDialogOpen(false); // Close the dialog
            // Optionally, you might want to show a success message here or via the store
            console.log('Image upload successful via store action!');

        } catch (error) {
            // Error handling from the store's perspective
            // Your store already logs the error, but you might want to set a local error message
            // or pass it from the store to the component.
            setErrorMessage('Failed to upload image. Please try again.');
            console.error('Upload failed in component:', error);
        }
    };

    return (
        <div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> {/* Added margin for icon */}
                        Update Image
                    </Button>
                </DialogTrigger>
                <DialogContent className="px-4 md:p-6">
                    <DialogHeader>
                        <DialogTitle>Update Profile Image</DialogTitle>
                    </DialogHeader>

                    {/* File input */}
                    <input
                        type="file"
                        accept="image/*" // Restrict to image files
                        onChange={handleFileChange}
                        className="my-4 p-2 border rounded-md w-full" // Added full width
                    />

                    {/* Display loading indicator */}
                    {isimage && (
                        <p className="text-blue-500 text-center">Uploading image, please wait...</p>
                    )}

                    {/* Display error message */}
                    {errorMessage && (
                        <p className="text-red-500 text-center">{errorMessage}</p>
                    )}

                    {/* Display selected file name */}
                    {selectedFile && !isimage && (
                        <p className="text-sm text-gray-600 text-center mt-2">
                            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                    )}

                    <DialogFooter className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-2">
                        <DialogClose asChild>
                            <Button variant="outline" disabled={isimage}>Cancel</Button>
                        </DialogClose>
                        <Button 
                            onClick={handleUpload} 
                            disabled={!selectedFile || isimage} // Disable if no file or uploading
                        >
                            {isimage ? 'Uploading...' : 'Upload'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EditProfile;