// Differential Privacy
dataset1 = `{
  "data": {
    "values": [
      { "x": 1, "y": 5 },
      { "x": 2, "y": 10 },
      { "x": 3, "y": 7 }
    ]
  },
  "//": "Privacy Preserving Grammar Below",
  "privacy": {
    "method": "differential-privacy",
    "parameter": 0.5,
    "quasi-identifier": "y"
  },
  "mark": "bar",
  "encoding": {
    "x": {
      "field": "x",
      "type": "ordinal"
    },
    "y": {
      "field": "y",
      "type": "quantitative"
    }
  }
}`;
// K-anonymity 
dataset2 = `{
  "data": {
    "values": [
      {"Age": 25, "Gender": "M", "Name": "Omar", "Disease": "Malaise"},
      {"Age": 22, "Gender": "F", "Name": "Katherine", "Disease": "Pneumonia"},
      {"Age": 37, "Gender": "F", "Name": "Maddie", "Disease": "Influenza"},
      {"Age": 29, "Gender": "M", "Name": "Manuel", "Disease": "Gastritis"},
      {"Age": 23, "Gender": "M", "Name": "David", "Disease": "Asthma"},
      {"Age": 41, "Gender": "F", "Name": "Laura", "Disease": "Diabetes"},
      {"Age": 28, "Gender": "M", "Name": "John", "Disease": "Hypertension"},
      {"Age": 30, "Gender": "F", "Name": "Anna", "Disease": "Bronchitis"}
    ]
  },
  "//": "Privacy Preserving Grammar Below",
  "privacy": {
    "method": "k-anonymity",
    "parameter": 4,
    "quasi-identifier": "Disease"
  },
  "layer": [
    {
      "mark": "rect",
      "encoding": {
        "x": {
          "field": "Disease",
          "type": "nominal",
          "axis": {
            "labelAngle": 45
          }
        },
        "y": {
          "field": "Gender",
          "type": "nominal"
        },
        "color": {
          "aggregate": "count",
          "type": "quantitative",
          "legend": false
        }
      }
    },
    {
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "middle",
        "dx": 0,
        "dy": 0
      },
      "encoding": {
        "x": {
          "field": "Disease",
          "type": "nominal"
        },
        "y": {
          "field": "Gender",
          "type": "nominal"
        },
        "text": {
          "aggregate": "count",
          "type": "quantitative"
        },
        "color": {
          "value": "white"
        }
      }
    }
  ]
}`;
// L-diversity
dataset3 = `{
  "data": {
    "values": [
      {"Age": 25, "Gender": "M", "Name": "Omar", "Disease": "Malaise"},
      {"Age": 22, "Gender": "F", "Name": "Katherine", "Disease": "Pneumonia"},
      {"Age": 37, "Gender": "F", "Name": "Maddie", "Disease": "Influenza"},
      {"Age": 29, "Gender": "M", "Name": "Manuel", "Disease": "Gastritis"}
    ]
  },
  "//": "Privacy Preserving Grammar Below",
  "privacy": {
    "method": "l-diversity",
    "parameter": 2,
    "quasi-identifier": "Disease", 
    "sensitive": "Gender"
  },
  "layer": [
    {
      "mark": "rect",
      "encoding": {
        "x": {
          "field": "Disease",
          "type": "nominal",
          "axis": {
            "labelAngle": 45
          }
        },
        "y": {
          "field": "Gender",
          "type": "nominal"
        },
        "color": {
          "aggregate": "count",
          "type": "quantitative",
          "legend": false
        }
      }
    },
    {
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "middle",
        "dx": 0,
        "dy": 0
      },
      "encoding": {
        "x": {
          "field": "Disease",
          "type": "nominal"
        },
        "y": {
          "field": "Gender",
          "type": "nominal"
        },
        "text": {
          "aggregate": "count",
          "type": "quantitative"
        },
        "color": {
          "value": "white"
        }
      }
    }
  ]
}`
// T-Closeness
dataset4 = `{
  "data": {
    "values": [
      {"Age": 25, "Gender": "M", "Name": "Omar", "Disease": "Malaise"},
      {"Age": 22, "Gender": "F", "Name": "Katherine", "Disease": "Pneumonia"},
      {"Age": 37, "Gender": "F", "Name": "Maddie", "Disease": "Influenza"},
      {"Age": 29, "Gender": "M", "Name": "Manuel", "Disease": "Gastritis"}
    ]
  },
  "//": "Privacy Preserving Grammar Below",
  "privacy": {
    "method": "t-closeness",
    "parameter": 0.45,
    "quasi-identifier": "Disease"
  },
  "layer": [
    {
      "mark": "rect",
      "encoding": {
        "x": {
          "field": "Disease",
          "type": "nominal",
          "axis": {
            "labelAngle": 45
          }
        },
        "y": {
          "field": "Gender",
          "type": "nominal"
        },
        "color": {
          "aggregate": "count",
          "type": "quantitative",
          "legend": false
        }
      }
    },
    {
      "mark": {
        "type": "text",
        "align": "center",
        "baseline": "middle",
        "dx": 0,
        "dy": 0
      },
      "encoding": {
        "x": {
          "field": "Disease",
          "type": "nominal"
        },
        "y": {
          "field": "Gender",
          "type": "nominal"
        },
        "text": {
          "aggregate": "count",
          "type": "quantitative"
        },
        "color": {
          "value": "white"
        }
      }
    }
  ]
}`
dataset5 = `{
  "data": {
    "values": [
      {"sepal_length": 5.1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2, "species": "setosa"},
      {"sepal_length": 4.9, "sepal_width": 3.0, "petal_length": 1.4, "petal_width": 0.2, "species": "setosa"},
      {"sepal_length": 4.7, "sepal_width": 3.2, "petal_length": 1.3, "petal_width": 0.2, "species": "setosa"},
      {"sepal_length": 4.6, "sepal_width": 3.1, "petal_length": 1.5, "petal_width": 0.2, "species": "setosa"},
      {"sepal_length": 5.0, "sepal_width": 3.6, "petal_length": 1.4, "petal_width": 0.2, "species": "setosa"},
      {"sepal_length": 5.4, "sepal_width": 3.9, "petal_length": 1.7, "petal_width": 0.4, "species": "setosa"},
      {"sepal_length": 5.5, "sepal_width": 2.3, "petal_length": 4.0, "petal_width": 1.3, "species": "versicolor"},
      {"sepal_length": 6.5, "sepal_width": 2.8, "petal_length": 4.6, "petal_width": 1.5, "species": "versicolor"},
      {"sepal_length": 6.7, "sepal_width": 3.1, "petal_length": 4.4, "petal_width": 1.4, "species": "versicolor"},
      {"sepal_length": 6.9, "sepal_width": 3.1, "petal_length": 4.9, "petal_width": 1.5, "species": "versicolor"},
      {"sepal_length": 7.0, "sepal_width": 3.2, "petal_length": 4.7, "petal_width": 1.4, "species": "versicolor"},
      {"sepal_length": 7.1, "sepal_width": 3.0, "petal_length": 5.9, "petal_width": 2.1, "species": "virginica"},
      {"sepal_length": 7.3, "sepal_width": 2.9, "petal_length": 6.3, "petal_width": 1.8, "species": "virginica"},
      {"sepal_length": 7.2, "sepal_width": 3.6, "petal_length": 6.1, "petal_width": 2.5, "species": "virginica"}
    ]
  },
  "//": "Privacy Preserving Grammar Below",
  "privacy": {
    "method": "k-anonymity",
    "parameter": 2,
    "quasi-identifier": "species"
  },
  "mark": "point",
  "encoding": {
    "x": {
      "field": "sepal_length",
      "type": "quantitative",
      "title": "Sepal Length (cm)"
    },
    "y": {
      "field": "sepal_width",
      "type": "quantitative",
      "title": "Sepal Width (cm)"
    },
    "color": {
      "field": "species",
      "type": "nominal"
    }
  }
}`

// logic to generate random examples
const numberOfExamples = 5
const exampleArray = []
for (let i = 1; i <= numberOfExamples; i++) {
    const dataset = eval(`dataset${i}`);  
    exampleArray.push(dataset);  
}

function randomExample() {
    const randomIndex = Math.floor(Math.random() * numberOfExamples);  
    return exampleArray[randomIndex];
}
