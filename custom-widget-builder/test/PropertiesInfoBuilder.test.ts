import {PropertiesInfoBuilder} from "../src/PropertiesInfoBuilder";

describe('PropertiesInfoBuilder', () => {

    test('should transform property name in property name readable for human', async () => {
        expect(PropertiesInfoBuilder.propertyDisplayName('minLength')).toBe("Min length")
        expect(PropertiesInfoBuilder.propertyDisplayName('maxLength')).toBe("Max length")
        expect(PropertiesInfoBuilder.propertyDisplayName('label-position')).toBe("Label position")
    });

    test('should transform component name name', async () => {
        expect(PropertiesInfoBuilder.componentDisplayName('uid-input')).toBe("Input")
        expect(PropertiesInfoBuilder.componentDisplayName('uid-input-with-validation')).toBe("InputWithValidation")
        expect(PropertiesInfoBuilder.componentDisplayName('wcExample')).toBe("WcExample")

    });
});