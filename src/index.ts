import { createReadStream } from 'node:fs';

main();

async function main() {
  console.log(process.argv);
  if (process.argv.length >= 5 || process.argv.length <= 2) {
    console.error(
      'Invalid command received.\nUsage: wc [optional flag] [file path]\nFor help enter: wc -h'
    );
    return;
  }

  const [arg1, arg2] = process.argv.slice(2);

  switch (arg1) {
    case '-c':
      countBytes(arg2);
      break;
    case '-l':
      countLines(arg2);
      break;
    case '-w':
      console.log('Counting words!');
      break;
    case '-m':
      console.log('Counting characters!');
      break;
    case '-h':
      printHelp();
      break;
    default:
      console.log('Treating arg1 as a filepath!');
      break;
  }
}

function countBytes(filePath: string) {
  try {
    const readableStream = createReadStream(filePath);
    let byteCount = 0;
    readableStream.on('data', (chunk) => {
      byteCount += chunk.length;
    });

    readableStream.on('close', () => {
      const leftOvers = readableStream.read();
      byteCount += +leftOvers;
      console.log(byteCount);
    });
  } catch (error) {
    console.log(error);
  }
}

function countLines(filePath: string) {
  try {
    const readableStream = createReadStream(filePath);
    let lineCount = 0;
    readableStream.on('data', (chunk) => {
      const chunkStr = chunk.toString();
      lineCount += [...chunkStr.matchAll(/\n/g)].length;
    });

    readableStream.on('close', () => {
      console.log(lineCount);
    });
  } catch (error) {
    console.log(error);
  }
}

function printHelp() {
  console.log("This is small recreation of Unix 'wc' command.");
  console.log('Accepted flags are:');
  console.log('\t-c: count the bytes from the target file');
}
