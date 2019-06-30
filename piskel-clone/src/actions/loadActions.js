/* global document, window */

function loadFile() {
  const promise = new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.own';
    input.style = 'display: none';

    const readFile = (file) => {
      if (file === null) return;
      const reader = new window.FileReader();
      reader.onload = () => {
        resolve({ result: reader.result, fileName: file.name });
      };
      reader.onerror = () => {
        reject(new Error('error'));
      };
      reader.readAsText(file);
    };

    input.onchange = () => {
      readFile(input.files[0]);
      input.remove();
    };
    document.body.appendChild(input);
    input.click();
  });

  return promise;
}

export default loadFile;
