import { ComponentStory, ComponentMeta } from '@storybook/react';
import AutoComplete from './autoComplete';

export default {
    title: 'example/AutoComplete',
    component: AutoComplete,
} as ComponentMeta<typeof AutoComplete>;
  
const Template: ComponentStory<typeof AutoComplete> = (args) => <AutoComplete {...args} />;

export const Default = Template.bind({});
// Default.storyName = 'Small';
// const lakers = ['bradley', 'pope', 'caruso', 'cook', 'cousins', 'james', 'AD', 'green', 'howard', 'kuzma'];
// const handleChange = (query: DataSourceType) => {
//     return lakers.filter(name => name.includes(query))
// }

Default.args = { 
    // fetchSuggestions: handleChange
};
