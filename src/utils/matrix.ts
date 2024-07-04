export class Matrix {
  constructor(
    public rows: number,
    public columns: number,
    public data: number[][] = [],
  ) {
    for (let row = 0; row < this.rows; row++) {
      this.data[row] ??= []

      for (let col = 0; col < this.columns; col++) {
        this.data[row][col] ??= 0
      }
    }
  }

  static fromArray(inputArray: number[][] | number[]) {
    switch (true) {
      case inputArray[0] instanceof Array: {
        if (new Set((inputArray as number[][]).map((a) => a.length)).size != 1) {
          throw Error("Array must be square")
        }

        return new Matrix(inputArray.length, inputArray[0].length, inputArray as number[][])
      }

      default: {
        const result = new Matrix(inputArray.length, 1)
        for (let row = 0; row < inputArray.length; row++) {
          result.data[row][0] = inputArray[row] as number
        }

        return result
      }
    }
  }

  toArray() {
    switch (this.rows) {
      case 1: {
        return this.data[0]
      }

      default: {
        return this.data
      }
    }
  }

  randomize(lower: number, upper: number) {
    if (lower === undefined || upper === undefined || upper < lower) {
      throw Error("Please specify upper and lower bounds!")
    }

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        this.data[row][col] = Math.random() * (upper - lower) + lower
      }
    }

    return this
  }

  map(func: (value: number, row: number, col: number) => number) {
    return Matrix.map(this, func)
  }

  static map(mat: Matrix, func: (value: number, row: number, col: number) => number) {
    const result = new Matrix(mat.rows, mat.columns)
    for (let row = 0; row < mat.rows; row++) {
      for (let col = 0; col < mat.columns; col++) {
        result.data[row][col] = func(mat.data[row][col], row, col)
      }
    }

    return result
  }

  dot(other: Matrix) {
    return Matrix.dot(this, other)
  }

  static dot(mat1: Matrix, mat2: Matrix) {
    if (mat1.columns !== mat2.rows) {
      throw Error("Columns of first must match rows of second!")
    }

    const result = new Matrix(mat1.rows, mat2.columns)

    for (let row = 0; row < mat1.rows; row++) {
      for (let col = 0; col < mat2.columns; col++) {
        let sum = 0
        for (let newCol = 0; newCol < mat1.columns; newCol++) {
          sum += mat1.data[row][newCol] * mat2.data[newCol][col]
        }
        result.data[row][col] = sum
      }
    }

    return result
  }

  multiply(other: Matrix | number) {
    return Matrix.multiply(this, other)
  }

  static multiply(mat1: Matrix, mat2: Matrix | number) {
    const result = new Matrix(mat1.rows, mat1.columns)

    if (mat2 instanceof Matrix) {
      if (mat1.rows !== mat2.rows || mat1.columns !== mat2.columns) {
        throw Error("Incompatible matrices for element-wise multiplication")
      }

      for (let row = 0; row < mat1.rows; row++) {
        for (let col = 0; col < mat1.columns; col++) {
          result.data[row][col] = mat1.data[row][col] * mat2.data[row][col]
        }
      }
    } else {
      for (let row = 0; row < mat1.rows; row++) {
        for (let col = 0; col < mat1.columns; col++) {
          result.data[row][col] = mat1.data[row][col] * mat2
        }
      }
    }

    return result
  }

  add(other: Matrix | number) {
    return Matrix.add(this, other)
  }

  static add(mat1: Matrix, other: Matrix | number) {
    const result = new Matrix(mat1.rows, mat1.columns)

    if (other instanceof Matrix) {
      if (mat1.rows !== other.rows || mat1.columns !== other.columns) {
        throw Error("Incompatible matrices for element-wise addition")
      }

      for (let row = 0; row < mat1.rows; row++) {
        for (let col = 0; col < mat1.columns; col++) {
          result.data[row][col] = mat1.data[row][col] + other.data[row][col]
        }
      }
    } else {
      for (let row = 0; row < mat1.rows; row++) {
        for (let col = 0; col < mat1.columns; col++) {
          result.data[row][col] = mat1.data[row][col] + other
        }
      }
    }

    return result
  }

  subtract(other: Matrix | number) {
    return Matrix.subtract(this, other)
  }

  static subtract(mat1: Matrix, mat2: Matrix | number) {
    const result = new Matrix(mat1.rows, mat1.columns)

    if (mat2 instanceof Matrix) {
      if (mat1.rows !== mat2.rows || mat1.columns !== mat2.columns) {
        throw Error("Incompatible matrices for element-wise subtraction")
      }

      for (let row = 0; row < mat1.rows; row++) {
        for (let col = 0; col < mat1.columns; col++) {
          result.data[row][col] = mat1.data[row][col] - mat2.data[row][col]
        }
      }
    } else {
      for (let row = 0; row < mat1.rows; row++) {
        for (let col = 0; col < mat1.columns; col++) {
          result.data[row][col] = mat1.data[row][col] - mat2
        }
      }
    }

    return result
  }

  transpose() {
    return Matrix.transpose(this)
  }

  static transpose(matrix: Matrix) {
    const result = new Matrix(matrix.columns, matrix.rows)
    for (let row = 0; row < matrix.rows; row++) {
      for (let col = 0; col < matrix.columns; col++) {
        result.data[col][row] = matrix.data[row][col]
      }
    }

    return result
  }
}
