import { DueDateCalculator, SimpleDueDateCalculatorStrategy, UpdatedDueDateCalculatorStrategy } from "./DueDateCalculator";


const dueDateCalculator = new DueDateCalculator();
const updatedDueDateCalculator = new DueDateCalculator(new UpdatedDueDateCalculatorStrategy());


