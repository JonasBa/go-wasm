package main

import (
	"encoding/json"
	"fmt"
	"syscall/js"
)

//ExportedObject t
type ExportedObject struct {
}

//Add t
func (e ExportedObject) Add(i, j int) int {
	return i + j
}

type Item struct {
	Name  string
	Price int
}

// Data t
type Data struct {
	Data []Item
}

//Convert t
func (e ExportedObject) Convert(search, input string) int {
	var data Data
	err := json.Unmarshal([]byte(input), &data)

	if err != nil {
		fmt.Println(err)
	}

	var result []Item

	for _, item := range data.Data {
		fmt.Println("DATA AT", item)

		if item.Name == search {
			result = append(result, item)
		}
	}

	return len(result)
}

// Search t
func Search(search, jsonString *string) []Item {
	var data Data
	var result []Item

	jsonCode := []byte(string(*jsonString))

	err := json.Unmarshal(jsonCode, &data)

	if err != nil {
		fmt.Println(err)
	}

	for _, item := range data.Data {
		if &item.Name == search {
			result = append(result, item)
			break
		}
	}

	return result
}

func main() {
	c := make(chan struct{}, 0)

	js.Global().Set("search", js.NewCallback(func(args []js.Value) {
		searchString := js.ValueOf(args[0]).String()
		jsonString := js.ValueOf(args[1]).String()

		fmt.Println(searchString, jsonString)
		result := Search(&searchString, &jsonString)

		data, err := json.Marshal(result)

		if err != nil {
			fmt.Println(err)
		}

		fmt.Println("I'M really done", result)
		js.Global().Set("goValue", string(data))
	}))

	<-c
}
