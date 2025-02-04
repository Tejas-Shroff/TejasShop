using server.Constants;
using server.Entities;
using server.Interface.Repository;
using server.Interface.Service;

namespace server.Service
{
    public class ImageService : IImageService
    {
        private readonly IWebHostEnvironment environment;
        private readonly IImageRepository imageRepository;

        public ImageService(IWebHostEnvironment environment,IImageRepository imageRepository)
        {
            this.environment = environment;
            this.imageRepository = imageRepository;
        }
        public async Task DeleteImageAsync(int Id)
        {
            Image? image = await imageRepository.GetByIdAsync(Id);
            if (image == null)  throw new ArgumentNullException($"{Image_C.NoImageFound}{Id}");
            var contentPath = environment.ContentRootPath;  // this will get the root path of the application.
            var imagePath = Path.Combine(contentPath, Image_C.Uploads);  
            var fileNameWithPath = Path.Combine(imagePath, image.ImageUrl);

            if (Directory.Exists(fileNameWithPath))
            {
                Directory.Delete(fileNameWithPath);
            }
            await imageRepository.DeleteAsync(image);
        }

        public async Task<Image> SaveImageAsync(IFormFile file)
        {
            if(file == null) throw new ArgumentNullException(Image_C.FileNotFound);

            var contentPath = environment.ContentRootPath;
            var imagePath = Path.Combine(contentPath, Image_C.Uploads);

            if (!Directory.Exists(imagePath)) 
            {
                Directory.CreateDirectory(imagePath); // this iwll create the upload folder if it does not exsists.
            }

            var imageName = file.FileName;
            var imageExt = Path.GetExtension(imageName);
            var fileName = $"{Guid.NewGuid().ToString()}{imageExt}"; // This gets the original file name and extension, then creates a new unique file name using a GUID.

            var fileNameWithPath = Path.Combine(imagePath, fileName); // This combines the directory path and the new file name to get the full path where the file will be saved.

            using var fileStream = new FileStream(fileNameWithPath, FileMode.Create);

            await file.CopyToAsync(fileStream); // This creates a file stream and copies the uploaded file to the server asynchronously.

            Image image = new Image()
            {
                ImageUrl = fileName,
                ImageName = imageName,
                ImageNameExt = imageExt
            }; // his creates a new Image object with the file details.

             return await imageRepository.AddAsync(image);  // saves it to repo 
        }
    }
}
