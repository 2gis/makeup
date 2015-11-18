import React, {Component} from 'react';
import s from './makeup.css';
import domProps from './props.js';

export default class Makeup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: true,
            zoom: 1,
            transparency: 1,
            mode: 2,
            background: 'transparency'
        };
    }

    getInput(props) {
        let ctx = this;
        let inputProps = Object.assign({
            onChange: e => ctx.setState({[props.name]: e.target.value})
        }, props);

        return <input type="text" className={s.input} {...inputProps} />;
    }

    getCheckbox(props) {
        let ctx = this;
        let Icon = props.icon;

        return (
            <div className={s.checkbox}>
                <input
                    type="checkbox"
                    className={s.hidden}
                    checked={!!ctx.state[props.name]}
                    onChange={e => ctx.setState({[props.name]: !ctx.state[props.name]})}
                    {...props}
                    />
                <label htmlFor={props.id} className={s.checkboxLabel} title={props.label}>
                    <Icon />
                </label>
            </div>
        );
    }

    getSlider(props) {
        let ctx = this;
        let sliderProps = Object.assign({
            value: ctx.state[props.name],
            onChange: event => ctx.setState({[props.name]: parseFloat(event.target.value)})
        }, props);

        return (
            <div className={s.tool}>
                <div className={s.toolTitle}>{props.title}</div>
                <input type="range" className={s.slider} {...sliderProps} />
            </div>
        );
    }

    getRadioGroup(props) {
        return (
            <div className={s.tool}>
                <div className={s.toolTitle}>{props.title}</div>
                {props.items.map(this.getRadio.bind(this))}
            </div>
        );
    }

    getRadio(props) {
        let ctx = this;
        let Icon = props.icon;

        return (
            <div className={s.radio} key={props.id}>
                <input
                    type="radio"
                    className={s.hidden}
                    checked={ctx.state[props.name] == props.value}
                    onChange={() => ctx.setState({[props.name]: props.value})}
                    {...props}
                    />
                <label htmlFor={props.id} className={s.radioLabel} title={props.label}>
                    <Icon />
                </label>
            </div>
        );
    }

    getSidebarGroup(props, key) {
        return (
            <div className={s.group} key={'section' + key}>
                <div className={s.groupTitle}>{props.label}</div>
                {props.items && props.items.map(this.getSidebarSection.bind(this))}
            </div>
        );
    }

    getSidebarSection(props, key) {
        let documentation = props.documentation && this.getDocumentation(props.documentation);
        let classNames = [s.section];
        let onClick = e => {
            if (props.expandable) {
                props.expanded = !props.expanded;
                this.forceUpdate();
            } else {
                console.log(props);
                this.setState({currentModule: props});
            }
        };

        if (typeof props.expanded == 'undefined') {
            props.expanded = true;
        }

        if (props.items) {
            props.expandable = true;
            classNames.push(s.sectionExpandable);

            if (props.expanded) {
                classNames.push(s.sectionExpanded);
            }
        }

        return (
            <div className={classNames.join(' ')} key={key}>
                <div className={s.sectionHeader} onClick={onClick}>
                    <div className={s.headerIn}>
                        <div className={s.meta}>{documentation}</div>
                        <div className={s.headerInner}>
                            <div className={s.title}>{props.label}</div>
                        </div>
                    </div>
                </div>
                {props.items && props.items.map(this.getSidebarSection.bind(this))}
            </div>
        );
    }

    getDocumentation(props) {
        let Icon = require('babel!svg-react!./assets/doc.svg');

        return (
            <div className={s.doc}>
                {ctx.map(item => (
                    <a href={item.link} title={item.label} className={s.docLink}>
                        <Icon className={s.docIcon} />
                    </a>
                ))}
            </div>
        );
    }

    componentDidUpdate() {
        console.log(this.state);
    }

    render() {
        let ctx = this.props;

        return (
            <div className={s.wrapper}>
                <div className={s.menu}>
                    {this.getCheckbox(domProps.toggler)}
                    {this.getInput(domProps.search)}
                    {this.getRadioGroup(domProps.mode)}
                    {this.getRadioGroup(domProps.background)}
                    {this.getSlider(domProps.transparency)}
                    {this.getSlider(domProps.zoom)}
                </div>
                <nav className={s.sidebar}>
                    {ctx.data && ctx.data.map(this.getSidebarGroup.bind(this))}
                </nav>

                <div className={s.main}>
                    {/* Rulers */}
                    <div className={s.container}>
                        <div className={s.module}>
                            <div className={s.image}></div>
                            <div className={s.markup}></div>
                        </div>
                    </div>
                </div>
                <footer className={s.statusbar}></footer>
            </div>
        );
    }
}
