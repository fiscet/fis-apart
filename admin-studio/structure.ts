import { StructureBuilder } from "sanity/structure";
import { FaHouseUser, FaBuilding, FaEnvelope } from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";

const groups = [
  {
    name: 'Auth & Users',
    icon: FaHouseUser,
    menuGroups: [
      ['user'],
      ['account', 'verificationToken'],
    ]
  },
  {
    name: 'Apartments',
    icon: FaBuilding,
    menuGroups: [
      ['apartment'],
      ['city', 'amenity', 'experienceCategory']
    ]
  },
  {
    name: 'Messages',
    icon: FaEnvelope,
    menuGroups: [
      ['availabilityRequest', 'chatWithAgents']
    ]
  }
];

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Main menu')
    .items([
      S.listItem()
        .title('Dashboard')
        .icon(BsGraphUp)
        .child(
          // Avoid importing TSX component during schema extract; render empty component instead
          S.component(() => null as any)
            .title('Dashboard')
        ),
      S.divider(),
      ...groups.map((group, i) => {
        return (
          S.listItem()
            .title(group.name)
            .icon(group.icon ?? null)
            .child(
              S.list()
                .title(group.name)
                .items([
                  ...(group.name === 'Apartments'
                    ? [
                      S.listItem()
                        .title('Featured Apartments')
                        .id('featuredApartments')
                        .child(
                          S.documentTypeList('apartment')
                            .title('Featured Apartments')
                            .filter('_type == "apartment" && featured == true')
                        ),
                      S.divider(),
                    ]
                    : []),
                  ...group.menuGroups.flatMap(menuGroup =>
                    [S.divider(), ...menuGroup.map(sType => S.documentTypeListItem(sType).id(sType).schemaType(sType))])
                ])
            ));
      })
    ]);
