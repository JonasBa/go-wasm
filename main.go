package main

import (
	"encoding/json"
	"fmt"
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

func main() {
	// c := make(chan struct{}, 0)

	Finder := ExportedObject{}
	data := Finder.Convert("what", "{\"data\":[{\"name\": \"whatt\"}, {\"name\": \"test\"}]}")
	fmt.Println(data)
	// <-c
}
