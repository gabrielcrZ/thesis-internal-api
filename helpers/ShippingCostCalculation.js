export const calculateShippingCost = (departureRegion, arrivalRegion) => {
    switch (true) {
      case departureRegion === "Africa" && arrivalRegion === "Africa":
        return 100000;
      case departureRegion === "Africa" && arrivalRegion === "Asia":
        return 150000;
      case departureRegion === "Africa" && arrivalRegion === "Central America":
        return 250000;
      case departureRegion === "Africa" && arrivalRegion === "Europe":
        return 200000;
      case departureRegion === "Africa" && arrivalRegion === "Middle East":
        return 250000;
      case departureRegion === "Africa" && arrivalRegion === "North America":
        return 300000;
      case departureRegion === "Africa" && arrivalRegion === "Pacific":
        return 250000;
      case departureRegion === "Africa" && arrivalRegion === "South America":
        return 300000;
      case departureRegion === "Asia" && arrivalRegion === "Asia":
        return 100000;
      case departureRegion === "Asia" && arrivalRegion === "Africa":
        return 150000;
      case departureRegion === "Asia" && arrivalRegion === "Central America":
        return 300000;
      case departureRegion === "Asia" && arrivalRegion === "Europe":
        return 200000;
      case departureRegion === "Asia" && arrivalRegion === "Middle East":
        return 250000;
      case departureRegion === "Asia" && arrivalRegion === "North America":
        return 250000;
      case departureRegion === "Asia" && arrivalRegion === "Pacific":
        return 350000;
      case departureRegion === "Asia" && arrivalRegion === "South America":
        return 150000;
      case departureRegion === "Central America" &&
        arrivalRegion === "Central America":
        return 100000;
      case departureRegion === "Central America" && arrivalRegion === "Africa":
        return 250000;
      case departureRegion === "Central America" && arrivalRegion === "Asia":
        return 350000;
      case departureRegion === "Central America" && arrivalRegion === "Europe":
        return 350000;
      case departureRegion === "Central America" &&
        arrivalRegion === "Middle East":
        return 250000;
      case departureRegion === "Central America" &&
        arrivalRegion === "North America":
        return 400000;
      case departureRegion === "Central America" && arrivalRegion === "Pacific":
        return 250000;
      case departureRegion === "Central America" &&
        arrivalRegion === "South America":
        return 200000;
      case departureRegion === "Europe" && arrivalRegion === "Europe":
        return 100000;
      case departureRegion === "Europe" && arrivalRegion === "Africa":
        return 250000;
      case departureRegion === "Europe" && arrivalRegion === "Asia":
        return 250000;
      case departureRegion === "Europe" && arrivalRegion === "Central America":
        return 350000;
      case departureRegion === "Europe" && arrivalRegion === "Middle East":
        return 300000;
      case departureRegion === "Europe" && arrivalRegion === "North America":
        return 400000;
      case departureRegion === "Europe" && arrivalRegion === "Pacific":
        return 300000;
      case departureRegion === "Europe" && arrivalRegion === "South America":
        return 350000;
      case departureRegion === "Middle East" && arrivalRegion === "Middle East":
        return 100000;
      case departureRegion === "Middle East" && arrivalRegion === "Africa":
        return 250000;
      case departureRegion === "Middle East" && arrivalRegion === "Asia":
        return 300000;
      case departureRegion === "Middle East" &&
        arrivalRegion === "Central America":
        return 350000;
      case departureRegion === "Middle East" && arrivalRegion === "Europe":
        return 300000;
      case departureRegion === "Middle East" && arrivalRegion === "North America":
        return 400000;
      case departureRegion === "Middle East" && arrivalRegion === "Pacific":
        return 400000;
      case departureRegion === "Middle East" && arrivalRegion === "South America":
        return 350000;
      case departureRegion === "North America" &&
        arrivalRegion === "North America":
        return 100000;
      case departureRegion === "North America" && arrivalRegion === "Africa":
        return 400000;
      case departureRegion === "North America" && arrivalRegion === "Asia":
        return 300000;
      case departureRegion === "North America" &&
        arrivalRegion === "Central America":
        return 250000;
      case departureRegion === "North America" && arrivalRegion === "Europe":
        return 400000;
      case departureRegion === "North America" && arrivalRegion === "Middle East":
        return 400000;
      case departureRegion === "North America" && arrivalRegion === "Pacific":
        return 300000;
      case departureRegion === "North America" &&
        arrivalRegion === "South America":
        return 200000;
      case departureRegion === "Pacific" && arrivalRegion === "Pacific":
        return 100000;
      case departureRegion === "Pacific" && arrivalRegion === "Africa":
        return 300000;
      case departureRegion === "Pacific" && arrivalRegion === "Asia":
        return 350000;
      case departureRegion === "Pacific" && arrivalRegion === "Central America":
        return 300000;
      case departureRegion === "Pacific" && arrivalRegion === "Europe":
        return 350000;
      case departureRegion === "Pacific" && arrivalRegion === "Middle East":
        return 250000;
      case departureRegion === "Pacific" && arrivalRegion === "North America":
        return 200000;
      case departureRegion === "Pacific" && arrivalRegion === "South America":
        return 250000;
      case departureRegion === "South America" &&
        arrivalRegion === "South America":
        return 100000;
      case departureRegion === "South America" && arrivalRegion === "Africa":
        return 250000;
      case departureRegion === "South America" && arrivalRegion === "Asia":
        return 300000;
      case departureRegion === "South America" &&
        arrivalRegion === "Central America":
        return 200000;
      case departureRegion === "South America" && arrivalRegion === "Europe":
        return 350000;
      case departureRegion === "South America" && arrivalRegion === "Middle East":
        return 400000;
      case departureRegion === "South America" &&
        arrivalRegion === "North America":
        return 250000;
      case departureRegion === "South America" && arrivalRegion === "Pacific":
        return 350000;
      default:
        100000;
    }
  };