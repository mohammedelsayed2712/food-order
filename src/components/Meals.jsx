import useHttp from "../hooks/useHttp";
import Errror from "./Errror";
import MealItem from "./MealItem";

const requestConfig = {};

function Meals() {
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp("http://localhost:3000/meals", requestConfig, []);

  if (isLoading) {
    return <p className="center">Fetching meals ...</p>;
  }

  if (error) {
    return <Errror title="Failed to fetch meals" message={error} />;
  }

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}

export default Meals;
