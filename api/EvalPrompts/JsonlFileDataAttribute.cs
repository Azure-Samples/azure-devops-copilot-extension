using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Xunit.Sdk;

namespace EvalPrompts
{
    public class JsonlFileDataAttribute : DataAttribute
    {
        private readonly string _filePath;
        
        /// <summary>
        /// Load data from a JSON file as the data source for a theory
        /// </summary>
        /// <param name="filePath">The absolute or relative path to the JSON file to load</param>
        /// <param name="propertyName">The name of the property on the JSON file that contains the data for the test</param>
        public JsonlFileDataAttribute(string filePath)
        {
            _filePath = filePath;
        }

        /// <inheritDoc />
        public override IEnumerable<object[]> GetData(MethodInfo testMethod)
        {
            if (testMethod == null) { throw new ArgumentNullException(nameof(testMethod)); }

            // Get the absolute path to the JSON file
            var path = Path.IsPathRooted(_filePath)
                ? _filePath
                : Path.GetRelativePath(Directory.GetCurrentDirectory(), _filePath);

            if (!File.Exists(path))
            {
                throw new ArgumentException($"Could not find file at path: {path}");
            }

            // Load the file
            var fileData = File.ReadAllText(_filePath);

            var jsonReader = new JsonTextReader(new StringReader(fileData))
            {
                SupportMultipleContent = true
            };

            var jsonSerializer = new JsonSerializer();

            var items = new List<object[]>();

            string? line;

            do
            {
                line = jsonReader.ReadAsString();
                items.Add(JsonConvert.DeserializeObject<object[]>(line!)!);
            } while (line != null);

            return items;
        }
    }
}
