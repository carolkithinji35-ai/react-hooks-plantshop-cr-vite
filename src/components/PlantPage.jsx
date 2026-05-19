import React, { useEffect, useState } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    price: "",
  });

  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then((response) => response.json())
      .then((data) => {
        const preparedPlants = data.map((plant) => ({
          ...plant,
          inStock: true,
        }));
        setPlants(preparedPlants);
      });
  }, []);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewPlantSubmit = (event) => {
    event.preventDefault();

    const newPlant = {
      name: formData.name,
      image: formData.image,
      price: formData.price,
    };

    fetch("http://localhost:6001/plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlant),
    })
      .then((response) => response.json())
      .then((createdPlant) => {
        setPlants((previousPlants) => [
          ...previousPlants,
          { ...createdPlant, inStock: true },
        ]);
        setFormData({ name: "", image: "", price: "" });
      });
  };

  const handleToggleStock = (plantId) => {
    setPlants((previousPlants) =>
      previousPlants.map((plant) =>
        plant.id === plantId ? { ...plant, inStock: !plant.inStock } : plant,
      ),
    );
  };

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <main>
      <NewPlantForm
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleNewPlantSubmit}
      />
      <Search searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <PlantList plants={filteredPlants} onToggleStock={handleToggleStock} />
    </main>
  );
}

export default PlantPage;
