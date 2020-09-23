# XSEF

> EDI Configuration 

## Overview

### Install 

```bash
npm install xsef --save

- or -

yarn add xsef

```

## Examples

**tradingChannel.xsef**
```toml
option = 2
useDatabase= true
password type = string

[Database settings]
nodes=5
user = admin 
; some comment
password = some very*difficult=password:
database-name =my-project-db

[User settings]
param*1  = 2.5
param*2= struct
```

### Example

```typescript
import { parse } from 'xsef';
import { readTextFile } from 'async-file';
readTextFile('configs.xsef').then((txt: string) => {
  console.log(parse(txt));
});
```

**Output:**
```JSON
{
  "option": 2,
  "useDatabase": true,
  "password type": "string",
  "Database settings": {
    "node": 5,
    "user": "admin",
    "password": "some very*difficult=password:"
  },
  "User settings": {
    "param*1": 2.5,
    "param*2": "struct"
  }
}
```


## API

> stable

### parse(data: string, params?: IParseConfig): object

**Alias:** `decode`
#### data
Type: `string`

String with xsef-like data
#### Parameters 

Type: `IParseConfig`

Decoding Parameters

|      name        | type       | defaut value |            description                                                          |
|------------------|------------|--------------|---------------------------------------------------------------------------------|
| **comment**      | `string`   | `;`          | String for start of comment                                                     |
| **delimiter**    | `string`   | `=`          | Delimiter between key and value                                                 |
| **nothrow**      | `boolean`  | `false`      | Use field `Symbol('Errors of parsing')` instead `throw`                         |
| **autoTyping**   | `boolean`  | `true`       | Try to auto translate strings to boolean / number values                        |
| **dataSections** | `string[]` | `[]`         | Section will be marked as dataSection and will be parsed like a array of string |
 
### Example


```toml
version = 2
someVaule = string

[some strings]
a82cfac96d9b71248bf5faa2b22d7cf7
0c420a02dc13656d15aefe71e5b06ecf

[User settings]
param*1  = 2.5
param*2= struct
```

```js
import { parse } from 'xsef';
import { readTextFile } from 'async-file';
readTextFile('configs.xsef').then((txt: string) => {
  console.log(parse(txt, { dataSections: ['some strings'] }));
});
```
Output:
```json
{
  "option": 2,
  "useDatabase": true,
  "password type": "string",
  "some strings": [
  	"a82cfac96d9b71248bf5faa2b22d7cf7",
  	"0c420a02dc13656d15aefe71e5b06ecf"
  ],
  "User settings": {
    "param*1": 2.5,
    "param*2": "struct"
  }
}
```

### stringify(data: object, params?: IStringifyConfig): string

**Alias:** `encode`
#### data

Type: `object`

object to encode to xsef-string

#### params

Type: `IStringifyConfig`

Encoding params

|      name       | type      | defaut value |            description                |
|-----------------|-----------|--------------|---------------------------------------|
| **delimiter**   | `string`  | `=`          | Delimiter between key and value       |
| **blankLine**   | `boolean` | `true`       | Add blank lines between sections      |
| **spaceBefore** | `boolean` | `true`       | Add space between key and delimiter   |
| **spaceAfter**  | `boolean` | `false`      | Add space between value and delimiter |

## License

MIT
